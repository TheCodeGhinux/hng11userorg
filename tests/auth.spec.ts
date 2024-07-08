import supertest from 'supertest'
import app from '../src/app'

describe('POST /api/auth/register', () => {
  it('registers a user successfully with default organisation', async () => {
    const response = await supertest(app)
      .post('/api/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '1234567890',
      })
      .expect(201)

    expect(response.body.accessToken).toBeDefined()
    expect(response.body.user.firstName).toBe('John')
    expect(response.body.user.email).toBe('john.doe@example.com')
    expect(response.body.user.phone).toBe('1234567890')
    expect(response.body.user.organisation).toBe("John's Organisation")
  })
})

describe('POST /api/auth/login', () => {
  it('logs in a user successfully with valid credentials', async () => {
    const response = await supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      })
      .expect(200)

    expect(response.body.accessToken).toBeDefined()
    expect(response.body.user.firstName).toBe('John')
    expect(response.body.user.email).toBe('john.doe@example.com')
  })

  it('fails to log in with invalid password', async () => {
    await supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'invalidpassword',
      })
      .expect(400)
  })

  it('fails to log in with non-existing email', async () => {
    await supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      })
      .expect(400)
  })
})

describe('POST /api/auth/register', () => {
  it('fails to register a user with missing required fields', async () => {
    // Test each required field missing scenario
    const scenarios = [
      {
        message: 'First name is required',
        payload: {
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
        },
      },
      {
        message: 'Last name is required',
        payload: {
          firstName: 'John',
          email: 'john.doe@example.com',
          password: 'password123',
        },
      },
      {
        message: 'Email is required',
        payload: {
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
        },
      },
    ]

    for (const scenario of scenarios) {
      const response = await supertest(app)
        .post('/api/auth/register')
        .send(scenario.payload)
        .expect(422)
      expect(response.body.message).toBe(scenario.message)
    }
  })
})

describe('POST /api/auth/register', () => {
  it('fails to register a user with duplicate email', async () => {
    // Register a user first
    await supertest(app)
      .post('/api/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '1234567890',
      })
      .expect(201)

    // Attempt to register with the same email
    const response = await supertest(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'john.doe@example.com',
        password: 'password456',
        phone: '0987654321',
      })
      .expect(422)
    expect(response.body.message).toBe('Email already exists')
  })
})
