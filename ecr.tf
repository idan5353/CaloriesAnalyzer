resource "aws_ecr_repository" "app" {
  name = "food-calorie-app"
  
  image_scanning_configuration {
    scan_on_push = true
  }
}
