package models

import "time"

type User struct {
    ID        int       `db:"id" json:"id"`
    Name      string    `db:"name" json:"name"`
    Email     string    `db:"email" json:"email"`
    Password  string    `db:"password,omitempty"`
    Role      string    `db:"role" json:"role"`
    CreatedAt time.Time `db:"created_at" json:"created_at"`
}
