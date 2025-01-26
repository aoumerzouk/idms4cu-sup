export const generateAccountNumber = (
  baseNumber: string,
  typeCode: string,
  suffix: string
): string => {
  // Ensure each part is padded correctly
  const paddedBase = baseNumber.padStart(7, '0');
  const paddedType = typeCode.padStart(3, '0');
  const paddedSuffix = suffix.padStart(3, '0');
  
  return `${paddedBase}${paddedType}${paddedSuffix}`;
};

export const parseAccountNumber = (fullAccountNumber: string) => {
  if (fullAccountNumber.length !== 13) {
    throw new Error('Invalid account number length');
  }

  return {
    base: fullAccountNumber.slice(0, 7),
    typeCode: fullAccountNumber.slice(7, 10),
    suffix: fullAccountNumber.slice(10)
  };
};

export const ACCOUNT_TYPE_CODES = {
  share: '001',
  draft: '002',
  certificate: '003',
  moneyMarket: '004',
  loan: '005',
  lineOfCredit: '006'
};

export const validateAccountParts = (base: string, typeCode: string, suffix: string): boolean => {
  // Base number must be 7 digits
  if (!/^\d{1,7}$/.test(base)) {
    throw new Error('Base number must be 1-7 digits');
  }

  // Type code must be 3 digits
  if (!/^\d{1,3}$/.test(typeCode)) {
    throw new Error('Type code must be 1-3 digits');
  }

  // Suffix must be 3 digits
  if (!/^\d{1,3}$/.test(suffix)) {
    throw new Error('Suffix must be 1-3 digits');
  }

  return true;
};
