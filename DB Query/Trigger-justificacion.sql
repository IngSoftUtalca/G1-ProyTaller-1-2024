CREATE TRIGGER set_periodo_activo_on_justificacion
    BEFORE INSERT ON Justificacion
    FOR EACH ROW
    BEGIN
        set New.Ramo_Periodo = (SELECT Periodo.ID FROM Periodo WHERE Periodo.Estado = 'activo');
    end;