import { z } from 'zod';

const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json({
          status: 'ERROR',
          message: 'Validation failed',
          errors: errors
        });
      }
      next(error);
    }
  };
};

export default validate;

