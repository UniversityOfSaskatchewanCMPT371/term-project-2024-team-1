import { UserSQLRepository } from '@app/adapter/SQLRepositories/User/UserSQLRepository';
import { User } from '@app/domain/User';

jest.mock('@app/adapter/SQLRepositories/SQLConfiguration', () => ({
    query: jest.fn(),
}));

describe('Integration Tests for UserSQLRepository', () => {
    const mockQuery = (queryResult: any) => {
        (require('@app/adapter/SQLRepositories/SQLConfiguration') as any).query.mockResolvedValue(queryResult);
    };
    it('should get all users', async () => {
        const userRepository = new UserSQLRepository();
        const mockUsers: User[] = [
            new User('testUserID', 'testUserPassword', 'testUserEmail', 1, 1),
            new User('testUserID2', 'testUserPassword2', 'testUserEmail2', 0, 2),
        ];
        mockQuery([mockUsers]);

        const result = await userRepository.getAll();

        expect(result).toEqual(mockUsers);
    });

    it('should get user by id', async () => {
        const userRepository = new UserSQLRepository();
        const mockUser = new User('testUserID', 'testUserPassword', 'testUserEmail', 1, 1);
        mockQuery([[mockUser]]);

        const result = await userRepository.getById('user1');

        expect(result).toEqual(mockUser);
    });

    it('should create a user', async () => {
        const userRepository = new UserSQLRepository();
        const mockUser = new User('testUserID', 'testUserPassword', 'testUserEmail', 1, 1);
        mockQuery(true);

        const result = await userRepository.create(mockUser);

        expect(result).toBeTruthy();
    });

    it('should update a user', async () => {
        const userRepository = new UserSQLRepository();
        const mockUser = new User('testUserID', 'testUserPassword', 'testUserEmail', 1, 1);
        mockQuery(true);

        const result = await userRepository.update(mockUser);

        expect(result).toBeTruthy();
    });

    it('should delete a user', async () => {
        const userRepository = new UserSQLRepository();
        mockQuery(true);

        const result = await userRepository.delete('testUserID');

        expect(result).toBeTruthy();
    });
});
