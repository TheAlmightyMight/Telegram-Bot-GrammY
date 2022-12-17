function nameValidator(name) {
  if (/[а-я]/gi.test(name) && /^([А-Я][а-я]+)(\s[А-Я][а-я]+)$/g.test(name)) {
    const arr = name.split(/\s/);

    return arr;
  }

  return null;
}

export default nameValidator;
