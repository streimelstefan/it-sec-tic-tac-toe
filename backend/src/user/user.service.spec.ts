import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserId } from './entities/user.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TestBed } from '@automock/jest';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let authService: AuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.create(UserService).compile();

    userService = unit;
    userRepository = unitRef.get<Repository<User>>(
      getRepositoryToken(User) as string,
    );
    authService = unitRef.get<AuthService>(AuthService);
    configService = unitRef.get<ConfigService>(ConfigService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe',
        password: 'password',
        isAdmin: false,
      };

      const user = new User();
      user.email = createUserDto.email;
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.userName = createUserDto.userName;

      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
      jest.spyOn(authService, 'setUserPassword').mockResolvedValue();

      const result = await userService.create(createUserDto);

      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(user);
      expect(authService.setUserPassword).toHaveBeenCalledWith(
        user,
        createUserDto.password,
      );
      expect(result).toEqual(user);
    });

    it('should throw a ConflictException if a user with the same username already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe',
        password: 'password',
        isAdmin: false,
      };

      jest.spyOn(userRepository, 'save').mockImplementation(() => {
        throw new Error();
      });

      expect(userService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of all users', async () => {
      const users: User[] = [
        {
          internalId: '1' as UserId,
          email: 'test1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userName: 'johndoe1',
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
        },
        {
          internalId: '2' as UserId,
          email: 'test2@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          userName: 'janesmith',
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
        },
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await userService.findAll();

      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return the user with the given internal ID', async () => {
      const internalId = '1' as UserId;
      const user: User = {
        internalId: '1' as UserId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await userService.findOne(internalId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { internalId },
      });
      expect(result).toEqual(user);
    });

    it('should throw a NotFoundException if no user with the given internal ID exists', async () => {
      const internalId = '1' as UserId;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      expect(userService.findOne(internalId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByUserName', () => {
    it('should return the user with the given username', async () => {
      const userName = 'johndoe';
      const user: User = {
        internalId: '1' as UserId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userName,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await userService.findOneByUserName(userName);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { userName },
      });
      expect(result).toEqual(user);
    });

    it('should throw a NotFoundException if no user with the given username exists', async () => {
      const userName = 'johndoe';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      expect(userService.findOneByUserName(userName)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update the user with the given internal ID', async () => {
      const internalId = '1' as UserId;
      const updateUserDto: UpdateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe',
      };

      const user: User = {
        internalId: '1' as UserId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      };

      jest.spyOn(userRepository, 'preload').mockResolvedValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await userService.update(internalId, updateUserDto);

      expect(userRepository.preload).toHaveBeenCalledWith({
        internalId,
        ...updateUserDto,
      });
      expect(userRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should throw a NotFoundException if no user with the given internal ID exists', async () => {
      const internalId = '1' as UserId;
      const updateUserDto: UpdateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe',
      };

      jest.spyOn(userRepository, 'preload').mockResolvedValue(undefined);

      expect(userService.update(internalId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove the user with the given internal ID', async () => {
      const internalId = '1' as UserId;
      const user: User = {
        internalId: '1' as UserId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      };

      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(user);

      const result = await userService.remove(internalId);

      expect(userService.findOne).toHaveBeenCalledWith(internalId);
      expect(userRepository.remove).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should throw a NotFoundException if no user with the given internal ID exists', async () => {
      const internalId = '1' as UserId;

      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      expect(userService.remove(internalId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('onModuleInit', () => {
    it('should call createDefaultAdminUserIfNotExists', async () => {
      jest.spyOn(userService, 'create').mockResolvedValue(undefined);

      await userService.onModuleInit();

      expect(userService.create).toHaveBeenCalled();
    });
  });
});
