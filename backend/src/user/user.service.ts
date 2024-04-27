import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserId } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { DatabaseError } from 'pg';
import { AuthService } from '../auth/services/auth.service';
import { Configuration } from '../configuration/configuration';
import { InjectConfig } from '@hydromerce/orange';

/**
 * Service for managing users.
 * @class
 */
@Injectable()
export class UserService {
  /**
   * @constructor
   * @param {Repository<User>} userRepository - The repository for User entities.
   * @param {AuthService} authService - The service for authentication-related operations.
   * @param {ConfigService} config - The service for configuration-related operations.
   */
  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectConfig()
    private readonly config: Configuration,
  ) { }

  /**
   * Creates a new user.
   * @param {CreateUserDto} createUserDto - The data transfer object for creating a user.
   * @returns {Promise<User>} - The created user.
   * @throws {ConflictException} - If a user with the same username already exists.
   */
  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);

      await this.authService.setUserPassword(user, createUserDto.password);

      return savedUser;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as DatabaseError;

        if (driverError.code === '23505') {
          throw new ConflictException(
            `A User with the username "${createUserDto.userName}" already exists.`,
          );
        }
      }

      throw error;
    }
  }

  /**
   * Finds all users.
   * @returns {Promise<User[]>} - An array of all users.
   */
  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Finds a user by their internal ID.
   * @param {UserId} internalId - The internal ID of the user.
   * @returns {Promise<User>} - The user.
   * @throws {NotFoundException} - If no user with the given internal ID exists.
   */
  public async findOne(internalId: UserId): Promise<User> {
    const user = this.userRepository.findOne({ where: { internalId } });

    if (!user) {
      throw new NotFoundException(
        `User with internalId ${internalId} does not exist`,
      );
    }

    return user;
  }

  /**
   * Finds a user by their username.
   * @param {string} userName - The username of the user.
   * @returns {Promise<User>} - The user.
   * @throws {NotFoundException} - If no user with the given username exists.
   */
  public async findOneByUserName(userName: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userName } });

    if (!user) {
      throw new NotFoundException(
        `User with username ${userName} does not exist`,
      );
    }

    return user;
  }

  /**
   * Updates a user.
   * @param {UserId} internalId - The internal ID of the user.
   * @param {UpdateUserDto} updateUserDto - The data transfer object for updating a user.
   * @returns {Promise<User>} - The updated user.
   * @throws {NotFoundException} - If no user with the given internal ID exists.
   */
  public async update(
    internalId: UserId,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.preload({
      internalId,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User ${internalId} not found`);
    }
    await this.userRepository.save(user);

    if (updateUserDto.password) {
      await this.authService.setUserPassword(user, updateUserDto.password);
    }

    return user;
  }

  /**
   * Removes a user.
   * @param {UserId} internalId - The internal ID of the user.
   * @returns {Promise<User>} - The removed user.
   * @throws {NotFoundException} - If no user with the given internal ID exists.
   */
  public async remove(internalId: UserId): Promise<User> {
    const user = await this.findOne(internalId);

    await this.authService.removeAuthDataOf(user.internalId);

    return this.userRepository.remove(user);
  }
}
