import { sha256 } from 'js-sha256';

function generateHash (message) {
    return sha256(message)
}

export default generateHash