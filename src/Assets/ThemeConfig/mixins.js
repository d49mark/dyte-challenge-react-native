export const size = {
  H0: 8,
  H1: 10,
  H2: 12,
  H3: 14,
  H5: 16,
  H6: 18,
  H7: 20,
};

export const getScaledSize = (scale, mixinSize) => {
  return scale * size[mixinSize];
};
