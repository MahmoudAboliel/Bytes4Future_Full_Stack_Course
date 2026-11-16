const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");
    return res.status(400).json({ message });
  }
  req.body = result.data;
  next();
};
export default validate;
