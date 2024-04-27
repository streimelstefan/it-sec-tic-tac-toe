import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TestBed } from '@automock/jest';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserId } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.create(UserController).compile();

    controller = unit;
    service = unitRef.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call userService.create with the correct parameters', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe',
        password: 'password',
        isAdmin: false,
      };
      const expectedResult: User = {
        internalId: '1' as UserId,
        email: 'test1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe1',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toBe(expectedResult);
    });
  });
});
