function nameValidator(name) {
  if (/[а-я]/gi.test(text) && /^([А-Я][а-я]+)(\s[А-Я][а-я]+)$/g.test(text)) {
    const arr = text.split(/\s/);

    return arr;
  }

  return null;
}

export default nameValidator;
