import {combineReducers} from "redux"
import messages from "./messages"
import users from "./users"

const chat = combineReducers({   // this method comes from redux
    messages,
    users
})

export default chat