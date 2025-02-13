import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/common/db/db.service';
import { CreateRepresentativeDTO } from './dto/create-representative.dto';
import { RepresentativeType } from './type/representative.type';
import { UpdateRepresentativeDTO } from './dto/update-representative.dto';
import { Representative } from '@prisma/client';

@Injectable()
export class RepresentativeService {
  constructor(private readonly dbService: DbService) {}

  /**
   * @name createRepresentative
   * @description Crea un nuevo representante en el sistema.
   * @async
   * @param {CreateRepresentativeDTO} createRepresentative - Un objeto DTO que contiene la información del nuevo representante.  Debe incluir validaciones para asegurar la integridad de los datos (ej., formato de email, longitud de campos).
   * @returns {Promise<RepresentativeType>} - Una promesa que resuelve al tipo de representante creado.
   * @throws {BadRequestException} - Si ya existe un representante con la misma CI (Cédula de Identidad) y correo electrónico.
   * @throws {BadRequestException} - Si ya existe un número de telefono registrado
   */
  async createRepresentative(
    createRepresentative: CreateRepresentativeDTO,
  ): Promise<RepresentativeType> {
    const { CI, email, ...rest } = createRepresentative;
    const representative = await this.dbService.representative.findUnique({
      where: {
        CI_email: { CI, email },
      },
    });
    const findPhone = await this.dbService.representative.findFirst({
      where: { phone: rest.phone },
    });
    if (representative) {
      throw new BadRequestException(
        `representative with CI: ${CI} already exists`,
      );
    }
    if (findPhone) {
      throw new BadRequestException(
        `phone number ${rest.phone} was already registered`,
      );
    }
    return await this.dbService.representative.create({
      data: {
        CI,
        email,
        ...rest,
      },
      select: {
        id: true,
        CI: true,
        email: true,
        names: true,
        lastnames: true,
        phone: true,
        debt: true,
        isDebtor: true,
        createdAt: true,
      },
    });
  }

  /**
   * @name getAllRepresentatives
   * @description Recupera todos los representantes del sistema.
   * @async
   *
   * @returns {Promise<RepresentativeType[]>} - Una promesa que resuelve a un array de objetos RepresentativeType, representando a todos los representantes.
   */
  async getAllRepresentatives(): Promise<RepresentativeType[]> {
    return await this.dbService.representative.findMany({
      select: {
        id: true,
        CI: true,
        email: true,
        names: true,
        lastnames: true,
        phone: true,
        debt: true,
        isDebtor: true,
        createdAt: true,
      },
    });
  }

  /**
   * @name getRepresentativeById
   * @description Recupera un representante por su ID.
   * @async
   * @param {string} id - El ID del representante a recuperar.
   * @returns {Promise<Representative>} - Una promesa que resuelve al objeto Representative si se encuentra, o null si no se encuentra.
   */
  async getRepresentativeById(id: string): Promise<Representative> {
    return await this.dbService.representative.findFirst({
      where: { id },
      include: { Students: true },
    });
  }

  /**
   * @name updateRepresentative
   * @description Actualiza la información de un representante existente.
   * @async
   * @param {string} id - El ID del representante que se va a actualizar.
   * @param {UpdateRepresentativeDTO} updateRepresentativeDto - Un objeto DTO que contiene los datos actualizados del representante.
   * @returns {Promise<RepresentativeType>} - Una promesa que resuelve al tipo de representante actualizado.
   * @throws {NotFoundException} - Si no se encuentra un representante con el ID especificado.
   * @throws {BadRequestException} - Si el número de teléfono ya está registrado para otro representante.
   * @throws {BadRequestException} - Si el correo electrónico ya está registrado para otro representante.
   */
  async updateRepresentative(
    id: string,
    updateRepresentativeDto: UpdateRepresentativeDTO,
  ): Promise<RepresentativeType> {
    const { debt, email, isDebtor, lastnames, names, phone } =
      updateRepresentativeDto;
    const representative = await this.dbService.representative.findFirst({
      where: { id },
    });
    const findPhone = await this.dbService.representative.findFirst({
      where: { phone },
    });
    const fintEmail = await this.dbService.representative.findFirst({
      where: { email },
    });

    if (!representative) {
      throw new NotFoundException(
        `representative with id: ${id} wasn't founded`,
      );
    }

    if (findPhone && findPhone.CI !== representative.CI) {
      throw new BadRequestException(
        'phone number already registered, please try another',
      );
    }

    if (fintEmail && fintEmail.CI !== representative.CI) {
      throw new BadRequestException(
        'email already registered, please try another',
      );
    }

    return await this.dbService.representative.update({
      where: {
        CI: representative.CI,
      },
      data: [debt, email, isDebtor, lastnames, names, phone],
      select: {
        id: true,
        CI: true,
        email: true,
        names: true,
        lastnames: true,
        phone: true,
        debt: true,
        isDebtor: true,
        createdAt: true,
      },
    });
  }
  /**
   * @name updateAllDebts
   * @description Actualiza la deuda de todos los representantes en el sistema.
   * @async
   * @param {number} newDebt - El nuevo valor de la deuda a asignar a todos los representantes.
   * @returns {Promise<Prisma.BatchPayload>} - Una promesa que resuelve a un objeto que contiene información sobre la cantidad de registros actualizados.
   * @throws {BadRequestException} - Si el valor de la deuda proporcionado no es válido (es decir, es nulo o no es un número).
   */
  async updateAllDebts(newDebt: number) {
    if (!newDebt) throw new BadRequestException('debt is required');
    return await this.dbService.representative.updateMany({
      data: [
        {
          debt: newDebt,
          isDebtor: newDebt > 0,
        },
      ],
    });
  }

  /**
   * @name deleteRepresentative
   * @description Elimina un representante del sistema por su ID.
   * @deprecated
   * @async
   * @param {string} id - El ID del representante a eliminar.
   * @returns {Promise<boolean>} - Una promesa que resuelve a `true` si el representante fue eliminado exitosamente.
   * @throws {NotFoundException} - Si no se encuentra un representante con el ID especificado.
   */
  async deleteRepresentative(id: string): Promise<boolean> {
    const representative = await this.dbService.representative.findFirst({
      where: { id },
    });
    if (!representative)
      throw new NotFoundException(
        `representative with id: ${id} wasn't founded`,
      );
    return !!(await this.dbService.representative.delete({
      where: {
        CI_email: { CI: representative.CI, email: representative.email },
      },
    }));
  }
}
