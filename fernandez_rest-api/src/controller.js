import {pool} from './database.js';

class LibroController{

     async getAll(req, res) {
          const [result] = await pool.query('SELECT * FROM libros');
          res.json(result);
    }
    async getOne(req, res){
     const id = req.body.id;
     const [result] = await pool.query('SELECT * FROM libros WHERE id = ?', [id]);
     if(result.length > 0) {
          res.json(result[0]);
     }else {
          res.status(404).json({"Error": `No se encontro el libro con el id ${id}`});
     }
    }
    async add(req, res){ 
         const libro = req.body; 
         const [result] = await pool.query(`INSERT INTO libros(nombre, autor, categoria, año_publicacion, isbn) VALUES(?,?,?,?,?)`, [libro.nombre, libro.autor, libro.categoria, libro.año_publicacion, libro.isbn]); 
         res.json({"ID Insertado": result.insertId}); 
     }
        async delete(req, res){
     const libro = req.body;
     const [result] = await pool.query(`DELETE FROM libros WHERE isbn=(?)`, [libro.isbn]);
     res.json({"Libro eliminado": result.affectedRows});
    }
    async update(req, res){
        try {
            const libro = req.body;
            const [result] = await pool.query(`UPDATE libros SET nombre=(?), autor=(?), categoria=(?), año_publicacion=(?), isbn=(?) WHERE id=(?)`,[libro.nombre, libro.autor, libro.categoria, libro.año_publicacion, libro.isbn, libro.id]);
            if (result.changedRows === 0) {
                throw new Error('No se encontró un libro con el ID proporcionado o los datos proporcionados ya existen.');
            }
            res.json({"Libros Actualizados": result.changedRows});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error al actualizar el libro, compruebe los campos requeridos.' });
        }
}    

export const libro = new LibroController();