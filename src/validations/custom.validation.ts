export const password = (value, helpers) => {
  if (value.length < 3) {
    return helpers.message('password must be at least 3 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      'password must contain at least 1 letter and 1 number',
    );
  }
  return value;
};
