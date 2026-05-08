import { Request, Response, NextFunction } from 'express';
import { getApplicationById } from '../controllers/applicationController';
import Application from '../models/Application';
import mongoose from 'mongoose';

jest.mock('../models/Application');

describe('Application Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getApplicationById', () => {
    it('should return application if found', async () => {
      const mockId = new mongoose.Types.ObjectId().toString();
      const mockApplication = { _id: mockId, company: 'Google' };

      mockRequest.params = { id: mockId };

      (Application.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockApplication),
      });

      await getApplicationById(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockApplication,
      });
    });

    it('should return 400 if ID is invalid', async () => {
      mockRequest.params = { id: 'invalid-id' };

      await getApplicationById(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      const call = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(call.statusCode).toBe(400);
      expect(call.message).toBe('Invalid application ID');
    });

    it('should return 404 if application not found', async () => {
      const mockId = new mongoose.Types.ObjectId().toString();
      mockRequest.params = { id: mockId };

      (Application.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await getApplicationById(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      const call = (nextFunction as jest.Mock).mock.calls[0][0];
      expect(call.statusCode).toBe(404);
      expect(call.message).toBe('Application not found');
    });
  });
});
