using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db) => _db = db;

    // GET api/users?search=ben&skip=0&take=50
    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] int skip = 0,
        [FromQuery] int take = 50)
    {
        if (take is < 1 or > 200) take = 50;

        var query = _db.Users
            .AsNoTracking()
            .Include(u => u.Phones)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(u =>
                u.Name.ToLower().Contains(s) ||
                u.Email.ToLower().Contains(s));
        }

        var users = await query
            .OrderBy(u => u.Id)
            .Skip(skip)
            .Take(take)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Phones = u.Phones.Select(p => p.Number).ToList()
            })
            .ToListAsync();

        return users;
    }

    // GET api/users/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDto>> GetById(int id)
    {
        var user = await _db.Users
            .AsNoTracking()
            .Include(u => u.Phones)
            .Where(u => u.Id == id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Phones = u.Phones.Select(p => p.Number).ToList()
            })
            .FirstOrDefaultAsync();

        if (user is null) return NotFound();

        return user;
    }

    // POST api/users
    [HttpPost]
    public async Task<ActionResult<UserDto>> Create(CreateUserDto dto)
    {
        var user = new User
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim(),
            Phones = dto.Phones
                .Where(p => !string.IsNullOrWhiteSpace(p))
                .Select(p => new Phone { Number = p.Trim() })
                .ToList()
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var result = new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phones = user.Phones.Select(p => p.Number).ToList()
        };

        return CreatedAtAction(nameof(GetById), new { id = user.Id }, result);
    }

    // PUT api/users/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CreateUserDto dto)
    {
        var user = await _db.Users
            .Include(u => u.Phones)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user is null) return NotFound();

        user.Name = dto.Name.Trim();
        user.Email = dto.Email.Trim();

        // Reemplazo simple de teléfonos (para practicar)
        user.Phones.Clear();
        foreach (var p in dto.Phones.Where(x => !string.IsNullOrWhiteSpace(x)))
        {
            user.Phones.Add(new Phone { Number = p.Trim() });
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE api/users/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user is null) return NotFound();

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
