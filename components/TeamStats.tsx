import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import { Cedula } from '@/types/cedulas';

interface SubItem {
  label: string;
  value: string;
}

interface MatchStatsProps {
  matchData: Cedula;
}

const MatchStatsCard = ({ matchData }: MatchStatsProps) => {
  const colorScheme = useColorScheme();

  const tarjetasAmarillas = matchData.tarjetas.filter(card => card.tipo === 'T-A').length;
  const tarjetasRojas = matchData.tarjetas.filter(card => card.tipo === 'T-R').length;
  const lesiones = matchData.lesiones.length;
  const cambios = matchData.cambios.length;

  const equipoLocal = matchData.datosPartido.equipoLocal.nombre;
  const equipoVisitante = matchData.datosPartido.equipoVisitante.nombre;

  const estadisticasLocal = {
    tarjetasAmarillas: matchData.tarjetas.filter(card => card.equipo === equipoLocal && card.tipo === 'T-A').length,
    tarjetasRojas: matchData.tarjetas.filter(card => card.equipo === equipoLocal && card.tipo === 'T-R').length,
    lesiones: matchData.lesiones.filter(lesion => lesion.equipo === equipoLocal).length,
    cambios: matchData.cambios.filter(cambio => cambio.equipo === equipoLocal).length,
  };

  const estadisticasVisitante = {
    tarjetasAmarillas: matchData.tarjetas.filter(card => card.equipo === equipoVisitante && card.tipo === 'T-A').length,
    tarjetasRojas: matchData.tarjetas.filter(card => card.equipo === equipoVisitante && card.tipo === 'T-R').length,
    lesiones: matchData.lesiones.filter(lesion => lesion.equipo === equipoVisitante).length,
    cambios: matchData.cambios.filter(cambio => cambio.equipo === equipoVisitante).length,
  };

  const renderStat = (label: string, value: string | number | boolean, subItems: SubItem[] = []) => {
    const displayValue = typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value;
    
    return (
      <View>
        <View style={styles.statRow}>
          <Text style={[styles.label, { color: Colors[colorScheme].text }]}>{label}</Text>
          <Text style={[styles.value, { color: Colors[colorScheme].text }]}>{displayValue}</Text>
        </View>
        {subItems.map((subItem, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={[styles.subLabel, { color: Colors[colorScheme].textSecondary }]}>{subItem.label}</Text>
            <Text style={[styles.subValue, { color: Colors[colorScheme].textSecondary }]}>{subItem.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: "#257E4217" }
    ]}>
      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Estadísticas del Partido</Text>
                  
      {renderStat('Tarjetas Amarillas', tarjetasAmarillas, 
        matchData.tarjetas.filter(card => card.tipo === 'T-A').map((card, index) => ({
          label: `Jugador (min ${card.minuto})`,
          value: card.jugador
        }))
      )}
      
      {renderStat('Tarjetas Rojas', tarjetasRojas, 
        matchData.tarjetas.filter(card => card.tipo === 'T-R').map((card, index) => ({
          label: `Jugador (min ${card.minuto})`,
          value: card.jugador
        }))
      )}
      
      {renderStat('Lesiones', lesiones, 
        matchData.lesiones.map((lesion, index) => ({
          label: `Jugador (${lesion.gravedad})`,
          value: `${lesion.jugador} - ${lesion.area}`
        }))
      )}
      
      {renderStat('Cambios', cambios, 
        matchData.cambios.map((cambio, index) => ({
          label: `Cambio ${index + 1}`,
          value: `${cambio.sale} → ${cambio.entra}`
        }))
      )}
      
      {renderStat('Árbitro Presente', matchData.asistioArbitro ? 'Sí' : 'No')}
      {renderStat('Médico Presente', matchData.asistioParamedico ? 'Sí' : 'No')}
      
      <View style={styles.divider} />
      
      <View style={styles.teamContainer}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>{equipoLocal}</Text>
        {renderStat('Tarjetas Amarillas', estadisticasLocal.tarjetasAmarillas)}
        {renderStat('Tarjetas Rojas', estadisticasLocal.tarjetasRojas)}
        {renderStat('Lesiones', estadisticasLocal.lesiones)}
        {renderStat('Cambios', estadisticasLocal.cambios)}
      </View>
      
      <View style={styles.teamContainer}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>{equipoVisitante}</Text>
        {renderStat('Tarjetas Amarillas', estadisticasVisitante.tarjetasAmarillas)}
        {renderStat('Tarjetas Rojas', estadisticasVisitante.tarjetasRojas)}
        {renderStat('Lesiones', estadisticasVisitante.lesiones)}
        {renderStat('Cambios', estadisticasVisitante.cambios)}
      </View>
      
      <View style={styles.divider} />
    </View>
  );
};

export default MatchStatsCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Layout.spacing.m,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.s,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  subLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: Layout.spacing.m,
  },
  subValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  teamContainer: {
    marginTop: Layout.spacing.l,
  },
  divider: {
    height: 1,
    marginVertical: Layout.spacing.m,
  },
});