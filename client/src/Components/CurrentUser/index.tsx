import React, {FC} from "react";
import { IUser } from "../../types/user";


export const CurrentUser: FC<any> = (props: any) => {
    const {currentUser} = props;

    return (
        <div>
            <div className="userColor"></div>
            <div className="userName">
                {currentUser.name}
            </div>
        </div>
    );
}
