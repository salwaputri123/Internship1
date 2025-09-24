package handlers

import (
	"database/sql"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"backend-app/config"
)

// jwtKey mengambil kunci rahasia dari variabel lingkungan.
var jwtKey = []byte(os.Getenv("JWT_SECRET"))

// Claims mendefinisikan struktur klaim JWT.
type Claims struct {
	UserID int    `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// LoginSuperAdmin adalah handler untuk mengotentikasi super admin.
func LoginSuperAdmin(c *gin.Context) {
	// Mendefinisikan struktur untuk request body.
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// Mengikat JSON dari request ke struct req.
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	// Mencari user di database berdasarkan email dan role "superadmin".
	var id int
	var hash, role string
	err := config.DB.QueryRow(
		"SELECT id, password, role FROM users WHERE email=? AND is_deleted=0",
		req.Email).Scan(&id, &hash, &role)

	// Memeriksa apakah user tidak ditemukan atau role bukan superadmin.
	if err == sql.ErrNoRows || role != "superadmin" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Super admin not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "DB error"})
		return
	}

	// Membandingkan password yang di-hash dengan password input.
	if bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Password salah"})
		return
	}

	// Menghasilkan JWT.
	claims := &Claims{
		UserID: id,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": t, "role": role})
}
func Login(c *gin.Context) {
    var req struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
        return
    }

    var id int
    var name, hash, role string
    err := config.DB.QueryRow(
        "SELECT id, name, password, role FROM users WHERE email=? AND is_deleted=0",
        req.Email,
    ).Scan(&id, &name, &hash, &role)

    if err == sql.ErrNoRows {
        c.JSON(http.StatusUnauthorized, gin.H{"message": "User tidak ditemukan"})
        return
    } else if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"message": "DB error"})
        return
    }

    if bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)) != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"message": "Password salah"})
        return
    }

    claims := &Claims{
        UserID: id,
        Role:   role,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    t, err := token.SignedString(jwtKey)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to generate token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "token": t,
        "role":  role,
        "email": req.Email,
        "name":  name,
    })
}
