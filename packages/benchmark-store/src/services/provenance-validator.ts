import { ReferenceProvenance, VerificationStatus } from '../types/benchmark-types.js';

export interface ProvenanceValidationResult {
  valid: boolean;
  errors: string[];
  effectiveStatus: VerificationStatus;
}

export function validateReferenceProvenance(
  provenance: ReferenceProvenance | undefined | null
): ProvenanceValidationResult {
  const errors: string[] = [];

  if (!provenance) {
    return {
      valid: false,
      errors: ['Reference provenance metadata is completely missing.'],
      effectiveStatus: 'UNVERIFIED',
    };
  }

  const requestedStatus: VerificationStatus = provenance.verificationStatus || 'UNVERIFIED';

  if (requestedStatus === 'VERIFIED') {
    if (!provenance.sourceSoftware || provenance.sourceSoftware.trim() === '') {
      errors.push('sourceSoftware is required for VERIFIED status.');
    }
    if (!provenance.sourceVersion || provenance.sourceVersion.trim() === '') {
      errors.push('sourceVersion is required for VERIFIED status.');
    }
    if (!provenance.sourceDate || provenance.sourceDate.trim() === '') {
      errors.push('sourceDate is required for VERIFIED status.');
    }
    if (!provenance.dataEntryMethod || provenance.dataEntryMethod.trim() === '') {
      errors.push('dataEntryMethod is required for VERIFIED status.');
    }
    if (!provenance.referenceCapturedBy || provenance.referenceCapturedBy.trim() === '') {
      errors.push('referenceCapturedBy is required for VERIFIED status.');
    }
    if (!provenance.sourceConfiguration || Object.keys(provenance.sourceConfiguration).length === 0) {
      errors.push('sourceConfiguration object is required for VERIFIED status.');
    }
  }

  const valid = errors.length === 0;
  const effectiveStatus = valid ? requestedStatus : 'UNVERIFIED';

  return {
    valid,
    errors,
    effectiveStatus,
  };
}

export function detectSelfReferencing(
  referenceValues: Record<string, any> | undefined | null,
  actualChartOutputs: Record<string, any> | undefined | null,
  provenance?: ReferenceProvenance | null
): { isSelfReferenced: boolean; reason?: string } {
  // Check provenance metadata for forbidden self-reference markers
  if (provenance) {
    const entryMethod = (provenance.dataEntryMethod || '').toUpperCase();
    const sourceSoftware = (provenance.sourceSoftware || '').toUpperCase();
    if (
      entryMethod.includes('INTERNAL_GENERATED') ||
      entryMethod.includes('COPIED_FROM_INTERNAL') ||
      sourceSoftware.includes('VEDICA_INTERNAL')
    ) {
      return {
        isSelfReferenced: true,
        reason: 'Anti-Self-Referencing Guard: Provenance metadata explicitly indicates internal Vedica output copying, which is forbidden for benchmark validation.',
      };
    }
  }

  if (!referenceValues || !actualChartOutputs) {
    return { isSelfReferenced: false };
  }

  const astRef = referenceValues.astrology || referenceValues;
  const planets = actualChartOutputs.planets;
  const ascendant = actualChartOutputs.ascendant;

  if (!astRef || !planets || !Array.isArray(planets)) {
    return { isSelfReferenced: false };
  }

  let matchCount = 0;
  let totalChecked = 0;

  // Check Ascendant
  const refAsc = astRef.ascendantLongitude ?? astRef.lagnaLongitude;
  if (typeof refAsc === 'number' && ascendant?.longitude !== undefined) {
    totalChecked++;
    if (Math.abs(refAsc - ascendant.longitude) < 0.000001) {
      matchCount++;
    }
  }

  // Check 9 planets
  const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  for (const pName of planetNames) {
    const refLng = astRef.planetaryLongitudes?.[pName] ?? astRef[pName.toLowerCase()]?.longitude;
    const actualP = planets.find((p: any) => p.planet?.toLowerCase() === pName.toLowerCase());

    if (typeof refLng === 'number' && actualP?.longitude !== undefined) {
      totalChecked++;
      if (Math.abs(refLng - actualP.longitude) < 0.000001) {
        matchCount++;
      }
    }
  }

  // If ALL checked coordinates match Vedica's floating-point precision identically (to 6 decimals), flag self-referencing!
  if (totalChecked >= 8 && matchCount === totalChecked) {
    return {
      isSelfReferenced: true,
      reason: `Anti-Self-Referencing Guard: Submitted reference longitudes match internal engine output identically across all ${totalChecked} points to 6 decimal places. External reference data must originate from an independent software calculation.`,
    };
  }

  return { isSelfReferenced: false };
}
