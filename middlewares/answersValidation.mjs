const answersValidation = (req, res, next) => {
    const { content } = req.body;
  
    // trim content first
    const trimmedContent = content?.trim();
  
    // validate content
    if (!trimmedContent || trimmedContent.length > 300) {
      return res.status(400).json({
        message: "Invalid request data.",
      });
    }
  
    req.body.content = trimmedContent;
    next();
  };
  
  export default answersValidation;
  
  