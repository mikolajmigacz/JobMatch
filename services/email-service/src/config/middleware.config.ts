import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';

const middlewareConfig = (app: express.Application) => {
  app.use(compression());

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });
    next();
  });
};

export default middlewareConfig;
