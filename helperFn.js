const { put } = require('./api')

async function updateUser(id, className, objectId) {
    const updatedUser = await put(`/classes/UserData/${id}`, { social: { "__type": "Pointer", "className": className, "objectId": objectId } })

    return updatedUser
}

module.exports = updateUser