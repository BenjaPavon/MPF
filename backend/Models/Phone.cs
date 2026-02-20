namespace backend.Models;

public class Phone
{
    public int Id { get; set; }
    public string Number { get; set; } = "";

    // FK. Un phone pertenece a un usuario. Esto crea una columna UserId en la tabla Phones, y una relación entre ambas tablas.
    public int UserId { get; set; }
    public User? User { get; set; }
}
