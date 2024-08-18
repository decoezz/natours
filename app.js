const path = require('path');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const reviewRouter = require('./routes/reviewRoutes.js');
const viewRouter = require('./routes/viewRoutes.js');
const bookingRouter = require('./routes/bookingRoutes.js');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const compression = require('compression');
const app = express();
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64'); // Generate a random nonce
  next();
});
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' https://api.maptiler.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://js.stripe.com blob: 'nonce-${res.locals.nonce}'; ` +
      "connect-src 'self' https://api.maptiler.com ws://127.0.0.1:*; " +
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; " +
      "img-src 'self' data: https://api.maptiler.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "frame-src 'self' https://js.stripe.com; " +
      'worker-src blob:; ' +
      "object-src 'none';",
  );
  next();
});

app.get('*.js.map', (req, res) => {
  res.status(204).send();
});
//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//1)Global MIDDLEWARES
//Set Secuirty HTTP header
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://api.maptiler.com',
          'https://cdn.jsdelivr.net',
          'https://js.stripe.com',
          'blob:',
          (req, res) => `'nonce-${res.locals.nonce}'`, // Add nonce to the script-src directive
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.jsdelivr.net',
          'https://fonts.googleapis.com',
        ],
        imgSrc: ["'self'", 'data:', 'https://api.maptiler.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        frameSrc: ['https://js.stripe.com'], // Allow framing from Stripe
        connectSrc: ["'self'", 'https://api.maptiler.com', 'ws://127.0.0.1:*'], // Allow WebSocket connections
        workerSrc: ["'self'", 'blob:'],
        objectSrc: ["'none'"],
      },
    },
  }),
);

//Development logging
app.use(morgan('dev'));
//Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP,please try again in an hour!',
});
app.use('/api', limiter);
//Body,parser,reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
//Data sanitization aganist NoSQL query injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());
//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);
app.use(compression());
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
