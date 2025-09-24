package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"backend-app/config"
)

// CreateUser -> tambah user baru (khusus superadmin)
func CreateUser(c *gin.Context) {
	var req struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	// Hash password
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Hash error"})
		return
	}

	// Insert ke database
	res, err := config.DB.Exec(
		"INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
		req.Name, req.Email, string(hashed), req.Role,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "DB insert error"})
		return
	}

	// Ambil ID user baru
	id, _ := res.LastInsertId()

	// Ambil timestamp sekarang
	createdAt := time.Now().Format(time.RFC3339)

	c.JSON(http.StatusOK, gin.H{
		"user": map[string]interface{}{
			"id":         id,
			"name":       req.Name,
			"email":      req.Email,
			"role":       req.Role,
			"created_at": createdAt,
		},
	})
}

// GetUsers -> ambil semua user (untuk dashboard superadmin)
func GetUsers(c *gin.Context) {
	rows, err := config.DB.Query("SELECT id, name, email, role, created_at FROM users WHERE is_deleted=0")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "DB error"})
		return
	}
	defer rows.Close()

	var users []map[string]interface{}
	for rows.Next() {
		var id int
		var name, email, role string
		var createdAt string
		err := rows.Scan(&id, &name, &email, &role, &createdAt)
		if err != nil {
			continue
		}
		users = append(users, map[string]interface{}{
			"id":         id,
			"name":       name,
			"email":      email,
			"role":       role,
			"created_at": createdAt,
		})
	}

	c.JSON(http.StatusOK, users)
}
