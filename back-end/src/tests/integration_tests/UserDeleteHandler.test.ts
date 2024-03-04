import { UserDeleteHandler } from '@app/adapter/Controllers/Handlers/UserDeleteHandler';
import { UserService } from '@app/application/UserService';
import { container } from 'tsyringe';
import { Request, Response } from 'express';

jest.mock('@app/application/UserService');

describe('UserDeleteHandler Integration Tests', () => {
    let userDeleteHandler: UserDeleteHandler;

    beforeEach(() => {
        userDeleteHandler = new UserDeleteHandler(container.resolve(UserService));
    });

    it('should handle and return success message on successful user deletion', async () => {
        const userId = 'testUserId';

        const req: Partial<Request> = {
            params: { userId },
        };

        const res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        (UserService.prototype.delete as jest.Mock).mockResolvedValue(true);

        userDeleteHandler.handle(req as Request, res as Response);

        await userDeleteHandler.execute(req as Request);

        expect(userDeleteHandler.validation).toBeTruthy;
        expect(UserService.prototype.delete).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(`Successfully removed user ${userId}`);
    });

    it('should handle and return 404 status if user not found', async () => {
        const userId = 'nonExistentUserId';

        (UserService.prototype.delete as jest.Mock).mockResolvedValue(false);

        const req: Partial<Request> = {
            params: { userId },
        };

        const res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        userDeleteHandler.handle(req as Request, res as Response);

        await userDeleteHandler.execute(req as Request);
        
        expect(userDeleteHandler.validation).toBeTruthy;
        expect(UserService.prototype.delete).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(`User ${userId} not found, delete was not performed`);
    });

    it('should handle validation error and return 422 status', async () => {
        const req: Partial<Request> = {
            params: {},
        };

        const res: Partial<Response> = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await userDeleteHandler.handle(req as Request, res as Response);

        expect(userDeleteHandler.validation).toBeFalsy;
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.send).toHaveBeenCalledWith('UserID is required');
    });
});