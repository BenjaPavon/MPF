namespace backend.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";

    // 1 usuario -> muchos teléfonos, es una propiedad. Basicamente esto crea una tabla intermedia UserPhones con UserId y PhoneId
    public List<Phone> Phones { get; set; } = new();
}
