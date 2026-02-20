namespace backend.Dtos;

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public List<string> Phones { get; set; } = new();
}
