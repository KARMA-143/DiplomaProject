class FileDTO {
    constructor(file) {
        this.id= file.id;
        this.name= file.name;
        this.size= file.size;
    }
}

module.exports = FileDTO;