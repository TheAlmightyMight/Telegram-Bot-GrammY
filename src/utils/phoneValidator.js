function phoneValidator(phone) {
  if (/\+\d{11}/g.test(phone)) {
    return phone;
  }

  return null;
}

export default phoneValidator;
