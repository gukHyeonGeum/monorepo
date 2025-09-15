export const toNumber = (v: string | number | null | undefined): number => {
  if (typeof v === 'number') return v;
  if (v == null || v === '') return 0;
  return Number(String(v).replace(/,/g, '')) || 0;
};

export const phoneFormat = (phone: string): string => {
  return phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
};
