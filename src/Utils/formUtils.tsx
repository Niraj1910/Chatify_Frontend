const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const data = new FormData(e.target as HTMLFormElement);

  const signUpData: { [key: string]: string } = {};

  data.forEach((item, key) => (signUpData[key] = item.toString()));

  console.log("signUpData -> ", signUpData);
  return signUpData;
};

export { handleFormSubmit };
