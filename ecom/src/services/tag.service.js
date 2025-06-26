const tagModel = require('../models/tag.model')
const { BadRequestError } = require('../res/error.response')

class TagServices {

    // Service to add new tag
    static addNewTag = async ({ name }) => {
    //    find if tag already created
        const existing = await tagModel.findOne({name: name})
        if(existing) throw new BadRequestError('Tag already taken')

        return await tagModel.create({name})
    }

    // List all tag
    static listAllTag = async() =>{
        return tagModel.findAll().lean()
    }

 
    // delete a tag
    static deleteTag = async (tagId) =>{
        const deleted = await tagModel.findByIdAndDelete(tagId)
        if(!deleted) throw new BadRequestError('Tag cannot be found!') 
    }
}

module.exports = TagServices