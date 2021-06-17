import cookie from 'cookie';
import cookieParser from 'cookie-parser';

export const logTimeRequest = (req, res, next) => {
  const startHrTime = process.hrtime();
  res.on('finish', () => {
    if (req.body && req.body.query) {
      if (req.body.operationName !== 'IntrospectionQuery') {
        const splitedQuery = req.body.query.split(' ');
        const opName = splitedQuery[2] + ' ' + splitedQuery[3];
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs =
          elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        console.log({
          type: 'timing',
          name: opName,
          ms: elapsedTimeInMs,
        });
      }
    }
  });

  next();
};

export const getCookieProp = (cookieFromRequest, name) => {
  const cookieParsed = cookieFromRequest.parse(cookieFromRequest);
  const unsigned = cookieParser.signedCookies(cookieParsed, process.env.SECRET);
  return unsigned[name] ?? null;
};
