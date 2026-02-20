namespace backend.Dtos;

public class CreateUserDto
{
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public List<string> Phones { get; set; } = new();
}
