const { put } = require('./api')

async function updateUser(id, where, className, objectId) {
    try {
        const updatedUser = await put(`/classes/UserData/${id}`, { [where]: { "__type": "Pointer", "className": className, "objectId": objectId } })
        return updatedUser
    } catch (error) {
        return error
    }

}

module.exports = updateUser