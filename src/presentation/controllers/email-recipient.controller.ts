import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEmailRecipientUseCase } from '../../application/use-cases/email-recipient/create-email-recipient.use-case';
import { GetEmailRecipientsUseCase } from '../../application/use-cases/email-recipient/get-email-recipients.use-case';
import { UpdateEmailRecipientUseCase } from '../../application/use-cases/email-recipient/update-email-recipient.use-case';
import { DeleteEmailRecipientUseCase } from '../../application/use-cases/email-recipient/delete-email-recipient.use-case';
import { CreateEmailRecipientDto, UpdateEmailRecipientDto, EmailRecipientResponseDto } from '../../application/dtos/email-recipient.dto';

@ApiTags('emails')
@Controller('emails')
export class EmailRecipientController {
  constructor(
    private readonly createEmailRecipientUseCase: CreateEmailRecipientUseCase,
    private readonly getEmailRecipientsUseCase: GetEmailRecipientsUseCase,
    private readonly updateEmailRecipientUseCase: UpdateEmailRecipientUseCase,
    private readonly deleteEmailRecipientUseCase: DeleteEmailRecipientUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar destinatário de e-mail' })
  @ApiResponse({ status: 201, description: 'Destinatário criado com sucesso' })
  async create(@Body() createEmailRecipientDto: CreateEmailRecipientDto) {
    const recipient = await this.createEmailRecipientUseCase.execute(createEmailRecipientDto);
    return EmailRecipientResponseDto.fromEntity(recipient);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os destinatários' })
  @ApiResponse({ status: 200, description: 'Lista de destinatários retornada com sucesso' })
  async findAll() {
    const recipients = await this.getEmailRecipientsUseCase.execute();
    return recipients.map(recipient => EmailRecipientResponseDto.fromEntity(recipient));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar destinatário' })
  @ApiResponse({ status: 200, description: 'Destinatário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Destinatário não encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmailRecipientDto: UpdateEmailRecipientDto,
  ) {
    const recipient = await this.updateEmailRecipientUseCase.execute({
      id,
      ...updateEmailRecipientDto,
    });
    return EmailRecipientResponseDto.fromEntity(recipient);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar destinatário' })
  @ApiResponse({ status: 200, description: 'Destinatário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Destinatário não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.deleteEmailRecipientUseCase.execute(id);
    return { message: 'Destinatário deletado com sucesso' };
  }

}
