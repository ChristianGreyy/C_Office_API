import { Injectable, Logger, UseGuards } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { EUserRole } from 'src/common/enums';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'socket',
})
@Injectable()
export class UserProfileGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    @WebSocketServer()
    public server: Server = new Server();
    private logger: Logger = new Logger('AppGateway');

    afterInit(): void {
        this.logger.log('Initialized socket!');
    }

    async handleConnection(socket: Socket): Promise<void> {
        this.logger.log(`Socket connected: ${socket.id}`);
    }

    async handleDisconnect(socket: Socket): Promise<void> {
        this.logger.log(`Socket disconnected: ${socket.id}`);
    }

    @SubscribeMessage('profile-event')
    // @UseGuards(UserSocketGuard)
    @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.USER])
    async handleSetClientDataEvent(
        @ConnectedSocket() socket: Socket,
        @UserDecorator() user: { id: number },
    ): Promise<void> {
       
    }

    @SubscribeMessage('signal')
    async signal(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        client.join(data.myId.toString())
        client.join(data.meetingName)
    }

    @SubscribeMessage('joinMeeting')
    async joinMeeting(@MessageBody() data: any) {
        // const user = await this.prisma.user.findFirst({
        //     where: {
        //         id: data.from
        //     }
        // })
        this.server.to(data.meetingName).emit("joinMeeting", { signal: data.signalData, from: data.from, fullName: data.fullName })
    }


    @SubscribeMessage('acceptMeeting')
    async acceptMeeting(@MessageBody() data: any) {
        this.server.to(data.meetingName).emit("acceptMeeting", data.signal)
    }

    // @UseGuards(UserSocketGuard)
    @SubscribeMessage('updateCamera')
    async updateCamera(@MessageBody() data: any) {
        this.server.to(data.meetingName).except(data.from.toString()).emit("updateCamera", data.isCameraOn)
    }

    @SubscribeMessage('updateAudio')
    async updateAudio(@MessageBody() data: any) {
        this.server.to(data.meetingName).except(data.from.toString()).emit("updateAudio", data.isMicrophoneOn)
    }

    @SubscribeMessage('shareScreen')
    async shareScreen(@MessageBody() data: any) {
        console.log('sharingg')
        this.server.to(data.meetingName).emit("shareScreen", data.screenStream)
    }
}

