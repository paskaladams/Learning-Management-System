import { Request, Response, NextFunction } from 'express';
import { CatchAsyncError } from './catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import jwt, { JwtPayload } from 'jsonwebtoken';
// import jwt, { Secret } from "jsonwebtoken";
import { redis } from '../utils/redis';
import { updateAccessToken } from '../controllers/user.controller';



// Authenticated user 1
// export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next:NextFunction) => {
// 	const access_token = req.cookies.access_token as string;

// 	if (!access_token) {
// 		return next(new ErrorHandler('Please login to access this resource', 400));
// 	}

// 	const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

// 	if (!decoded) {
// 		return next(new ErrorHandler('Access token is not valid', 400));
// 	}

// 	const user = await redis.get(decoded.id);

// 	if (!user) {
// 		return next(new ErrorHandler('Please login to access this resource', 400));
// 	}

// 	req.user = JSON.parse(user);

// 	next();
// });

// Authenticated user 2
interface ExtendedRequest extends Request {
	user?: any;
  }

export const isAuthenticated = CatchAsyncError(
	async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	  const access_token = req.cookies.access_token;
	  if (!access_token) {
		return next(new ErrorHandler("Please login to access", 400));
	  }
	  const decoded = jwt.decode(access_token) as JwtPayload | null;
  
	  if (!decoded) {
		return next(new ErrorHandler("Access token is not valid", 400));
	  }
	  // Check if the access token is is expired
	  if (decoded.exp && decoded.exp <= Date.now() / 1000) {
		try {
		  await updateAccessToken(req, res, next);
		} catch (error) {
		  return next(error);
		}
	  } else {
		const user = await redis.get(decoded.id);
		if (!user) {
		  return next(
			new ErrorHandler("Please login to access this resource..!", 400)
		  );
		}
		req.user = JSON.parse(user);
		next();
	  }
	}
  );

// Authenticated user 3
// export const isAuthenticated = CatchAsyncError(
// 	async (req: Request, res: Response, next: NextFunction) => {
// 	  try {
// 		const access_token = req.cookies.access_token;
// 		if (!access_token) {
// 		  return next(new ErrorHandler("please login first ! ", 400));
// 		}
// 		const decode = jwt.verify(
// 		  access_token,
// 		  process.env.ACCESS_TOKEN as Secret
// 		) as { id: string };
// 		if (!decode) {
// 		  return next(new ErrorHandler("invalid access token! ", 400));
// 		}
// 		const user = await redis.get(decode?.id); //this is will edit after
// 		if (!user) {
// 		  return next(new ErrorHandler("user not found ! ", 404));
// 		}
// 		req.user = JSON.parse(user);
// 		next();
// 	  } catch (error: any) {
// 		next(new ErrorHandler(error.message, 400));
// 	  }
// 	}
//   );

// Validate user role
export const authorizeRoles = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if(!roles.includes(req.user?.role || '')) {
			return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 403));
		}
		next();
	}
}