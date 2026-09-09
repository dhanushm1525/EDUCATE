import { RefreshAccessTokenDTO } from "../dtos/auth/RefreshAccessTokenDTO";
import { RefreshAccessTokenResponseDTO } from "../dtos/auth/RefreshAccessTokenResponseDTO";


export interface IRefreshAccessToken{
    execute(request:RefreshAccessTokenDTO):Promise<RefreshAccessTokenResponseDTO>
}