import { Response } from 'express';
import CourseModel from '../models/course.model';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import { json } from 'stream/consumers';

// Create Course
export const createCourse = CatchAsyncError(async (data: any, res: Response) => {
	const course = await CourseModel.create(data);
	res.status(201).json({
		success: true,
		course,
	});
});

// Get all courses
export const getAllCoursesServices = async (res: Response) => {
	const courses = await CourseModel.find().sort({ createdAt: -1 });

	res.status(201).json({
		success: true,
		courses,
	});
};