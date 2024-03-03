import { UserGetAllHandler } from '@app/adapter/Controllers/Handlers/UserGetAllHandler';
import { UserService } from '@app/application/UserService';
import { User } from '@app/domain/User';
import { container } from 'tsyringe';
import { Request, Response } from 'express';

jest.mock('@app/application/UserService');

describe('UserGetAllHandler Integration Tests', () => {
    let userGetAllHandler: UserGetAllHandler;

    beforeEach(() => {
        userGetAllHandler = new UserGetAllHandler(container.resolve(UserService));
    });

    it('should handle and return user list', async () => {
        const mockUserList: User[] = [
            new User('testUserID', 'testUserPassword', 'testUserEmail', 1, 1),
            new User('testUserID2', 'testUserPassword2', 'testUserEmail2', 0, 2),
        ];

        (UserService.prototype.getAll as jest.Mock).mockResolvedValue(mockUserList);

        const req: Partial<Request> = {};
        const res: Partial<Response> = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        userGetAllHandler.handle(req as Request, res as Response);
        await userGetAllHandler.execute(req as Request);

        expect(UserService.prototype.getAll).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(mockUserList);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle validation error and return 400 status', async () => {
        jest.spyOn(userGetAllHandler, 'validation').mockReturnValue(false);

        const req: Partial<Request> = {};
        const res: Partial<Response> = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
    };

        userGetAllHandler.handle(req as Request, res as Response);
        userGetAllHandler.validation("test");
        await userGetAllHandler.execute(req as Request);

        expect(res.status).toHaveBeenCalledWith(400);
    });
});
