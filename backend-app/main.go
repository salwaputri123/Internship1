package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"backend-app/config"
	"backend-app/handlers"
)

func main() {
	_ = godotenv.Load()
	config.Connect()

	r := gin.Default()

	// 🔑 Middleware CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	r.POST("/api/auth/login", handlers.Login) // login semua role
	r.POST("/api/users", handlers.CreateUser) // tambah user superadmin
	r.GET("/api/users", handlers.GetUsers)    // ambil semua user

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}
	log.Println("Server running on http://localhost:" + port)
	r.Run(":" + port)
}
