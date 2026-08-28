import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository";
import { ITokenHasher } from "../../interfaces/ITokenHasher";
import { LogoutUserDTO } from "../../dtos/auth/LogoutUserDTO";


export class LogoutUser{
    constructor(
        private readonly refreshTokenRepository:IRefreshTokenRepository,
        private readonly tokenHasher:ITokenHasher
    ){}


    async execute(request:LogoutUserDTO):Promise<void>{
        const {refreshToken} = request

        if(!refreshToken){return }

        const tokenHash = this.tokenHasher.hash(refreshToken);

        const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);


        if(!storedToken){return}

        if(storedToken.revokedAt!==null){
            return
        }


        await this.refreshTokenRepository.revokeById(storedToken.id);
    }
}