output "elastic_ip" {
  value = aws_eip.app_eip.public_ip
}
