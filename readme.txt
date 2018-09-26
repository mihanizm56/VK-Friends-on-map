
командой gulp производится создание папки build, 
сборка html,css,js файлов и выгрузка в build

перед сборкой сделать gulp clean

(для сборки модулей js использован browserify) 

Отдельные таски:
gulp clean - очистка папки build
gulp html - копирование основного файла в build
gulp css - сборка css стилей в build
gulp js - сборка модулей js в build
gulp watch - отслеживание html,css,js изменений в исходниках
gulp webserver - поднятие dev-сервера browserSync
