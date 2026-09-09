import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository";
import { ITokenHasher } from "../../interfaces/ITokenHasher";
import { LogoutUserDTO } from "../../dtos/auth/LogoutUserDTO";


export class LogoutUser{
    constructor(
        private readonly _refreshTokenRepository:IRefreshTokenRepository,
        private readonly _tokenHasher:ITokenHasher
    ){}


    async execute(request:LogoutUserDTO):Promise<void>{
        const {refreshToken} = request

        if(!refreshToken){return }

        const tokenHash = await this._tokenHasher.hash(refreshToken);

        const storedToken = await this._refreshTokenRepository.findByTokenHash(tokenHash);


        if(!storedToken){return}

        if(storedToken.revokedAt!==null){
            return
        }


        await this._refreshTokenRepository.revokeById(storedToken.id);
    }
}